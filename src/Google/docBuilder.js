import { getFromBackend } from '../DataProvider/backendHelpers';
import { sendAuthorizedApiRequest } from './requestAuthorization.js';

export const copyGoogleDocTemplate = async (record, formattedEventDate) => {
  const requestDetails = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
    method: 'POST',
    path: `https://www.googleapis.com/drive/v3/files/1_VQBWLCrHLSiy3j1TicaLt2O8PIDf3ayPHG5woemsVU/copy`,
    params: {
      supportsSharedDrives: true,
      fields: 'id',
    },
    body: JSON.stringify({
      parents: ['10EXyxpVqTqHdJJB1S-MkVTTQS-usasgV'],
      name: `${record.client} - ${formattedEventDate}`,
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

    let jobString = `${musician.fName} ${musician.lName} - ${instrument.name}`;
    return job.attributes.md ? jobString + '/MD' : jobString;
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
      content: record.client,
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
