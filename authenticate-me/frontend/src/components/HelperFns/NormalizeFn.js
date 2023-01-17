const normalizeFn = (data) => {
  const normalizeData = {};
  data.forEach((val) => normalizeData[ val.id ] = val);
  return normalizeData;
};

export default normalizeFn;
