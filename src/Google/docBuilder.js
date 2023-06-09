import { getFromBackend } from '../DataProvider/backendHelpers';
import { sendAuthorizedApiRequest } from './requestAuthorization.js';

export const generateGoogleFolderName = (date) => {
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();
  return `${month} ${year}`;
};

export const getGoogleFolderByName = async (folderName) => {
  const requestDetails = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
    method: 'GET',
    path: `https://www.googleapis.com/drive/v3/files?${new URLSearchParams({
      q: `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and '1Op2KYN8kCoMblWoqagvwUeH6yKyYgHL3' in parents`,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    })}`,
  };

  const res = await sendAuthorizedApiRequest(
    requestDetails,
    'https://www.googleapis.com/auth/drive'
  );
  if (res.files.length > 1) {
    throw new Error('More than one folder found for current month!');
  }
  if (!res.files.length) {
    return null;
  }
  return res.files[0];
};

export const createNewGoogleFolder = async (folderName) => {
  const requestDetails = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
    method: 'POST',
    path: `https://www.googleapis.com/drive/v3/files?${new URLSearchParams({
      supportsAllDrives: true,
    })}`,
    body: JSON.stringify({
      parents: ['1Op2KYN8kCoMblWoqagvwUeH6yKyYgHL3'],
      mimeType: 'application/vnd.google-apps.folder',
      name: folderName,
    }),
  };

  return await sendAuthorizedApiRequest(
    requestDetails,
    'https://www.googleapis.com/auth/drive'
  );
};

export const copyGoogleDocTemplate = async (
  record,
  formattedEventDate,
  folderID
) => {
  const requestDetails = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
    method: 'POST',
    path: `https://www.googleapis.com/drive/v3/files/1pp6LAyYva9KzmpTkj4FVTruypzhhAuRkOZPlAJ2LFsw/copy?${new URLSearchParams(
      {
        supportsAllDrives: true,
      }
    )}`,
    body: JSON.stringify({
      parents: [folderID],
      name: `${record.client.data.attributes.fName} ${
        record.client.data.attributes.lName
      } - ${new Date(record.date).toLocaleDateString()}`,
      labelInfo: {
        labels: [
          {
            id: 'vb2ibFTCEZ1B6Y8iI4Q0rcu1dB4hGzaeVbaSNNEbbFcb',
          },
        ],
      },
    }),
  };

  return await sendAuthorizedApiRequest(
    requestDetails,
    'https://www.googleapis.com/auth/drive'
  );
};

export const saveDocumentIdToDB = async (record, googleDocId) => {
  // Call strapi api to update event record with new google doc id in db
  const token = localStorage.getItem('token');
  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/api/events/${record.id}`,
    {
      method: 'PUT',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          googleDocId,
        },
      }),
    }
  );
  if (response.status !== 200) {
    throw new Error(`STATUS: ${response.status}, error saving document to DB`);
  }
  return response;
};

export const populateDocContent = async (
  record,
  googleDocId,
  formattedEventDate
) => {
  const jobs = await getFromBackend('jobs', record.jobs);

  const jobDetailsArray = jobs.data.map((job) => {
    const musician = job.attributes.musician.data.attributes;
    const instrument = job.attributes.instrument.data.attributes;

    return `${instrument.name}${job.attributes.md ? '/MD' : ''} - ${
      musician.fName
    } ${musician.lName}`;
  });

  console.log('HERE', record);

  const requests = buildBatchUpdates([
    {
      textToReplace: '{{eventType}}',
      content: record.type.data.attributes.name,
    },
    {
      textToReplace: '{{package}}',
      content: record.package.data.attributes.name,
    },
    {
      textToReplace: '{{client}}',
      content: `${record.client.data.attributes.fName} ${record.client.data.attributes.lName}`,
    },
    {
      textToReplace: '{{date}}',
      content: formattedEventDate,
    },
    {
      textToReplace: '{{jobs}}',
      content: jobDetailsArray.join('\n'),
    },
    {
      textToReplace: '{{address}}',
      content: record.location,
    },
    {
      textToReplace: '{{notes}}',
      content: record.notes,
    },
  ]);

  console.log('STRINGIFIED REQS', requests);
  const requestDetails = {
    method: 'POST',
    path: `https://docs.googleapis.com/v1/documents/${googleDocId}:batchUpdate`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
    body: JSON.stringify({
      requests: requests,
    }),
  };

  return await sendAuthorizedApiRequest(
    requestDetails,
    'https://www.googleapis.com/auth/drive'
  );
};

export const buildBatchUpdates = (eventDetails) => {
  return eventDetails.map((detail) => {
    return {
      replaceAllText: {
        containsText: {
          text: detail.textToReplace,
          matchCase: true,
        },
        replaceText: detail.content,
      },
    };
  });
};
