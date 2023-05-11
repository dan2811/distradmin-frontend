/* eslint-disable no-loop-func */
import {
  fetchUtils,
  GET_LIST,
  GET_ONE,
  GET_MANY,
  GET_MANY_REFERENCE,
  CREATE,
  UPDATE,
  UPDATE_MANY,
  DELETE,
  DELETE_MANY,
} from 'react-admin';
import { createStrapiFilter } from './strapiFilters';

/**
 * Maps react-admin queries to a simple REST API
 * @example
 * GET_LIST     => GET http://my.api.url/posts?sort=['title','ASC']&range=[0, 24]
 * GET_ONE      => GET http://my.api.url/posts/123
 * GET_MANY     => GET http://my.api.url/posts?filter={ids:[123,456,789]}
 * UPDATE       => PUT http://my.api.url/posts/123
 * CREATE       => POST http://my.api.url/posts
 * DELETE       => DELETE http://my.api.url/posts/123
 */
export const DataProvider = (
  apiUrl,
  httpClient = fetchUtils.fetchJson,
  uploadFields = []
) => {
  /**
   * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
   * @param {String} resource Name of the resource to fetch, e.g. 'posts'
   * @param {Object} params The data request params, depending on the type
   * @returns {Object} { url, options } The HTTP request parameters
   */
  const convertDataRequestToHTTP = (type, resource, params) => {
    console.log('Convert data request to HTTP', type, resource, params);
    let url = '';
    const options = {};
    switch (type) {
      case GET_LIST:
      case GET_MANY_REFERENCE:
        if (resource.includes('users')) {
          console.log('YOOOOO ', resource);
          url = `${apiUrl}/${resource}`;
        } else {
          url = `${apiUrl}/${resource}?${adjustQueryForStrapi(
            params
          )}&populate=%2A`;
        }
        break;
      case GET_ONE:
        url = `${apiUrl}/${resource}/${params.id}?populate=%2A`;
        break;
      case UPDATE:
        url = `${apiUrl}/${resource}/${params.id}`;
        options.method = 'PUT';
        // Omit created_at/updated_at(RDS) and createdAt/updatedAt(Mongo) in request body
        options.body = JSON.stringify({ data: params.data, id: params.id });
        break;
      case CREATE:
        url = `${apiUrl}/${resource}`;
        options.method = 'POST';
        options.body = JSON.stringify(params);
        break;
      case DELETE:
        url = `${apiUrl}/${resource}/${params.id}`;
        options.method = 'DELETE';
        break;
      default:
        throw new Error(`Unsupported fetch action type ${type}`);
    }
    return { url, options };
  };

  const adjustQueryForStrapi = (params) => {
    /*
      params = { 
          pagination: { page: {int} , perPage: {int} }, 
          sort: { field: {string}, order: {string} }, 
          filter: {Object}, 
          target: {string}, (REFERENCE ONLY)
          id: {mixed} (REFERENCE ONLY)
      }
      */

    // Handle SORTING
    const s = params.sort;
    const sort =
      s.field === ''
        ? 'sort[0]=updated_at:desc'
        : 'sort[0]=' + s.field + ':' + s.order;

    // Handle FILTER
    const f = params.filter;
    console.log('Filter: ', f);
    let filter = '';
    const keys = Object.keys(f);
    keys.forEach((key, idx) => {
      if (key.includes('_')) {
        filter += createStrapiFilter(key, f[key]);
      } else {
        //react-admin uses q filter in several components and strapi use _q
        if (f[key]) {
          if (key === 'q' && f.q !== '') {
            filter += '_q=' + f[key] + (keys[idx + 1] ? '&' : '');
          } else if (Array.isArray(f[key])) {
            const arrayOfFilterValues = f[key];
            arrayOfFilterValues.forEach((val, idx) => {
              filter += `&filters[${key}][$in][${idx}]=${val}`;
            });
          } else {
            filter += `&filters[${key}]=` + f[key] + (keys[idx + 1] ? '&' : '');
          }
        }
      }
    });

    if (params.id && params.target && params.target.indexOf('_id') !== -1) {
      const target = params.target.substring(0, params.target.length - 3);
      console.log('target: ' + target);
      filter += '&' + target + '=' + params.id;
    }

    // filters[id][$in][0]=3&filters[id][$in][1]=6&filters[id][$in][2]=8
    // filters[$in][0][id]=1&filters[$in][1][id]=2&populate=%2A

    // Handle PAGINATION
    const { page, perPage } = params.pagination;
    const pagination =
      'pagination[page]=' + page + '&pagination[pageSize]=' + perPage;

    console.log('returning from filter: ', sort + '&' + pagination + filter);
    return sort + '&' + pagination + filter;
  };

  // Determines if there are new files to upload
  const determineUploadFieldNames = (params) => {
    if (!params.data) return [];

    // Check if the field names are mentioned in the uploadFields
    // and verify there are new files being added
    const requestUplaodFieldNames = [];
    Object.keys(params.data).forEach((field) => {
      let fieldData = params.data[field];
      if (uploadFields.includes(field)) {
        fieldData = !Array.isArray(fieldData) ? [fieldData] : fieldData;
        fieldData.filter((f) => f && f.rawFile instanceof File).length > 0 &&
          requestUplaodFieldNames.push(field);
      }
    });

    // Return an array of field names where new files are added
    return requestUplaodFieldNames;
  };

  // Handles file uploading for CREATE and UPDATE types
  const handleFileUpload = (type, resource, params, uploadFieldNames) => {
    const { created_at, updated_at, createdAt, updatedAt, ...data } =
      params.data;
    const id = type === UPDATE ? `/${params.id}` : '';
    const url = `${apiUrl}/${resource}${id}`;
    const requestMethod = type === UPDATE ? 'PUT' : 'POST';
    const formData = new FormData();

    for (let fieldName of uploadFieldNames) {
      let fieldData = params.data[fieldName];
      fieldData = !Array.isArray(fieldData) ? [fieldData] : fieldData;
      const existingFileIds = [];

      for (let item of fieldData) {
        item.rawFile instanceof File
          ? formData.append(`files.${fieldName}`, item.rawFile)
          : existingFileIds.push(item.id || item._id);
      }

      data[fieldName] = [...existingFileIds];
    }
    formData.append('data', JSON.stringify(data));

    return httpClient(url, {
      method: requestMethod,
      body: formData,
    }).then((response) => ({ data: replaceRefObjectsWithIds(response.json) }));
  };

  // Replace reference objects with reference object IDs
  const replaceRefObjectsWithIds = (json) => {
    Object.keys(json).forEach((key) => {
      const fd = json[key]; // field data
      const referenceKeys = [];
      if (fd && (fd.id || fd._id) && !fd.mime) {
        json[key] = fd.id || fd._id;
      } else if (Array.isArray(fd) && fd.length > 0 && !fd[0].mime) {
        fd.map((item) => referenceKeys.push(item.id || item._id));
        json[key] = referenceKeys;
      }
    });
    return json;
  };

  /**
   * @param {Object} response HTTP response from fetch()
   * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
   * @param {String} resource Name of the resource to fetch, e.g. 'posts'
   * @param {Object} params The data request params, depending on the type
   * @returns {Object} Data response
   */
  const convertHTTPResponse = (response, type, resource, params) => {
    const { json } = response;
    console.log('DATAPROVIDER LOGS', { resource, type });
    switch (type) {
      case GET_ONE:
        console.log(
          'GET ONE response (flattened) ',
          flattenNestedRelations(response.json)
        );
        return {
          data: flattenNestedRelations(response.json),
        };
      // return { data: replaceRefObjectsWithIds(json) };
      case GET_LIST:
      case GET_MANY_REFERENCE:
        return {
          data: flattenNestedRelations(response.json),
          total: json.total,
        };
      case CREATE:
        return { data: { ...params.data, id: json.id } };
      case UPDATE:
        return { data: params.data };
      case DELETE:
        return { data: { id: null } };
      default:
        return { data: json };
    }
  };

  /**
   * @param {string} type Request type, e.g GET_LIST
   * @param {string} resource Resource name, e.g. "posts"
   * @param {Object} payload Request parameters. Depends on the request type
   * @returns {Promise} the Promise for a data response
   */
  return (type, resource, params) => {
    // Handle file uploading
    const uploadFieldNames = determineUploadFieldNames(params);
    if (uploadFieldNames.length > 0) {
      return handleFileUpload(type, resource, params, uploadFieldNames);
    }

    // simple-rest doesn't handle filters on UPDATE route, so we fallback to calling UPDATE n times instead
    if (type === UPDATE_MANY) {
      return Promise.all(
        params.ids.map((iD) => {
          // Omit created_at/updated_at(RDS) and createdAt/updatedAt(Mongo) in request body
          const {
            created_at,
            updated_at,
            createdAt,
            updatedAt,
            id,
            ...attributes
          } = params.attributes;
          return httpClient(`${apiUrl}/${resource}/${iD}`, {
            method: 'PUT',
            body: JSON.stringify(attributes),
          });
        })
      ).then((responses) => ({
        data: responses.map((response) => response.json),
      }));
    }
    // simple-rest doesn't handle filters on DELETE route, so we fallback to calling DELETE n times instead
    if (type === DELETE_MANY) {
      return Promise.all(
        params.ids.map((id) =>
          httpClient(`${apiUrl}/${resource}/${id}`, {
            method: 'DELETE',
          })
        )
      ).then((responses) => ({
        data: responses.map((response) => response.json),
      }));
    }
    //strapi doesn't handle filters in GET route
    if (type === GET_MANY) {
      const promises = Promise.all(
        params.ids.map((i) =>
          httpClient(`${apiUrl}/${resource}/${i.id || i._id || i}`, {
            method: 'GET',
          })
        )
      ).then((responses) => {
        const mappedResponses = {
          data: responses.map((response) => {
            return {
              ...response.json.data.attributes,
              id: response.json.data.id,
            };
          }),
        };
        return mappedResponses;
      });
      return promises;
    }

    const { url, options } = convertDataRequestToHTTP(type, resource, params);

    // Get total via model/count endpoint
    if (type === GET_MANY_REFERENCE || type === GET_LIST) {
      const { url: urlForCount } = convertDataRequestToHTTP(
        type,
        resource + '/count',
        params
      );
      return Promise.all([
        httpClient(url, options),
        httpClient(urlForCount, options),
      ]).then((promises) => {
        let response = {
          ...promises[0],
        };
        if (url.includes('api/users') || urlForCount.includes('api/users')) {
          //custom logic for /users path - strapi plugin api responses do not return with the same format
          return {
            data: promises[0].json,
            total: promises[0].json.length,
          };
        }
        return convertHTTPResponse(response, type, resource, params);
      });
    } else {
      return httpClient(url, options).then((response) =>
        convertHTTPResponse(response, type, resource, params)
      );
    }
  };
};

const flattenNestedRelations = (response) => {
  const responseKeys = Object.keys(response);
  const flattenedResponse = {};

  for (let i = 0; i < responseKeys.length; i++) {
    let key = responseKeys[i];
    //This checks for array and object because arr is an object in js
    if (typeof response[key] !== 'object') {
      continue;
    }

    if (key === 'data' && Array.isArray(response[key])) {
      console.log('if statement A');
      //flattens the attribbutes to the same level as the ids.
      flattenedResponse.data = response.data.map((obj) => {
        return {
          ...obj.attributes,
          id: obj.id,
        };
      });
      //flattens the relations to be an array of objects with only one level containing ids and attributes
      flattenedResponse.data.map((topLevelItem) => {
        return Object.keys(topLevelItem).forEach((key) => {
          if (topLevelItem[key] === null) {
            //do nothin
          } else {
            if (
              topLevelItem[key].hasOwnProperty('data') &&
              Array.isArray(topLevelItem[key].data)
            ) {
              topLevelItem[key] = [...topLevelItem[key].data];
              topLevelItem[key] = topLevelItem[key].map((element) => {
                return {
                  ...element.attributes,
                  id: element.id,
                };
              });
            }
          }
        });
      });
    } else {
      console.log('if statement B');
      flattenedResponse.data = {
        ...response.data.attributes,
        id: response.data.id,
      };
      Object.keys(flattenedResponse.data).forEach((key) => {
        if (flattenedResponse.data[key] === null) {
          //do nothin
        } else {
          if (
            flattenedResponse.data[key].hasOwnProperty('data') &&
            Array.isArray(flattenedResponse.data[key].data)
          ) {
            flattenedResponse.data[key] = [...flattenedResponse.data[key].data];
            flattenedResponse.data[key] = flattenedResponse.data[key].map(
              (element) => {
                return element.id;
              }
            );
          }
        }
      });
    }
  }
  console.log('DATAPROVIDER RESPONSE (FLATTENED): ', flattenedResponse);
  return flattenedResponse.data;
};
