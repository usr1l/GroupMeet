function objDeepCopyFn(obj) {
  if (typeof obj !== 'object') {
    return obj;
  };

  const copy = {}
  for (let item in obj) {
    copy[ item ] = objDeepCopyFn(obj[ item ]);
  };

  return copy;

};

export default objDeepCopyFn;
