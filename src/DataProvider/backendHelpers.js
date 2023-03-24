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

  console.log('FILTER STRING: ', filterString);

  const paginationString = `pagination[page]=${page}&pagination[pageSize]=${pageSize}`;

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
    },
    body: JSON.stringify(body),
  });
};
