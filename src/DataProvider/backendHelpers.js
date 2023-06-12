export const getFromBackend = async (
  collectionType,
  ids = null,
  pagination = {}
) => {
  const { page = 1, pageSize = 999999 } = pagination;
  const jwt = localStorage.getItem('token');
  let filterString = `?`;

  if (ids) {
    ids.forEach((id, idx) => {
      if (idx !== 0) {
        filterString += '&';
      }
      filterString += `filters[$or][${idx}][id][$eq]=${id}`;
    });
  }

  const paginationString = `&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;

  const res = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/api/${collectionType}${filterString}${paginationString}&populate=*`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
  );
  return res.json();
};

export const postBackend = (route, body) => {
  const jwt = localStorage.getItem('token');
  return fetch(`${process.env.REACT_APP_BACKEND_URL}/api${route}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${jwt}`,
      type: 'Application/JSON',
    },
    body: JSON.stringify(body),
  });
};

export const putBackend = (route, body) => {
  const jwt = localStorage.getItem('token');
  console.log(JSON.stringify({ data: body }));
  const res = fetch(`${process.env.REACT_APP_BACKEND_URL}/api${route}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${jwt}`,
      'Content-Type': 'Application/JSON',
    },
    body: JSON.stringify({ data: body }),
  });
  return res;
};
