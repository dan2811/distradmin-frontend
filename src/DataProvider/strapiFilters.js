import qs from 'qs';

export const createStrapiFilter = (field, value) => {
  const formattedFilters = {};

  const [fieldName, operator] = field.split('_');

  if (typeof value === 'object') {
    //is filter by relation using array of ids
    if (!Array.isArray(value.id)) {
      console.warn(
        'Was expecting array of ids, but got ',
        JSON.stringify(value)
      );
    }
    formattedFilters[fieldName] = createFilterForRelation(value);
    return;
  }

  formattedFilters[fieldName] = createSimpleFilterObject(operator, value);

  return (
    '&' +
    qs.stringify(
      { filters: formattedFilters },
      {
        encodeValuesOnly: true,
      }
    )
  );
};

const createSimpleFilterObject = (operator, value) => {
  console.log('OPERATOR', operator);
  return operator ? { ['$' + operator]: value } : { $eq: value };
};

const createFilterForRelation = (filter) => {
  console.log('COMPLEX');
  return {
    id: {
      $in: filter.id,
    },
  };
};

// console.log('Filter: ', JSON.stringify(filter));

// // filters is like [
// //    { resource: "events", "field": "id" operator: "$eq", value: [1, 2, 3]},
// //    { resource: "events", "field": "date" operator: "$gte", value: '2018-01-01'}
// // ]

// const filters = Object.keys(filter).map((key) => {
//   if (typeof filter[key] === 'object' && !Array.isArray(filter[key])) {
//     console.log('hereyo');
//     let [resource, operator] = key.split('_');
//     const filterArr = Object.keys(filter[key]).map((field) => {
//       return operator
//         ? {
//             resource,
//             operator: `$${operator}`,
//             field,
//             value: filter[key][field],
//           }
//         : { resource, operator: `$eq`, field, value: filter[key][field] };
//     });
//     return filterArr.flat();
//   }
//   let [field, operator] = key.split('_');
//   return operator
//     ? { field, operator: `$${operator}`, value: filter[key] }
//     : { field: key, operator: '$eq', value: filter[key] };
// });

// const qsObj = {
//   filters: {},
// };
// console.log('FILTER! ', filters);

// filters.forEach((filter, idx) => {
//   console.log('FILTER, ', idx, filter[idx]);
//   if (Array.isArray(filter[idx].value)) {
//     console.log('ISARRAY');

//     qsObj.filters[filter[idx].resource] = filter[idx].value.map((value) => {
//       return {
//         $or: {
//           [filter[idx].field]: {
//             [filter[idx].operator]: value,
//           },
//         },
//       };
//     });
//   } else {
//     console.log('NOTARRAY');
//     qsObj.filters[filter.field] = {
//       [filter.operator]: filter.value,
//     };
//   }
// });

// console.log('qsObj', qsObj);

// qs.stringify(qsObj, {
//   encodeValuesOnly: true,
// })
