const generateUrl = (name, payload) => {
  if (!name) return "";
  let url = "";
  if (payload === undefined || !payload || Object.keys(payload).length === 0) {
    url = name;
    return url;
  }

  Object.keys(payload).forEach((x, i) => {
    if (i === 0) {
      if (x && payload[x] !== undefined) {
        url += `${name}?${x}=${payload[x]}`;
      }
    } else {
      if (x && payload[x] !== undefined) {
        url += `&${x}=${payload[x]}`;
      }
      // url += `&${x}=${payload[x]}`;
    }
  });

  return url;
};

export default generateUrl;
