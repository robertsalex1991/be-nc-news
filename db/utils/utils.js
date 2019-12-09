exports.formatDates = list => {
  if (list.length === 0) return [];
  return list.map(listObj => {
    const cloneObj = { ...listObj };
    const date = new Date(cloneObj.created_at).toUTCString();
    cloneObj.created_at = date;
    return cloneObj;
  });
};

exports.makeRefObj = (data, ref1, ref2) => {
  const obj = {};
  data.forEach(dataObj => {
    const key = dataObj[ref1];
    const value = dataObj[ref2];
    obj[key] = value;
  });

  return obj;
};

exports.formatComments = (comments, articleRef) => {
  if (comments.length === 0) return [];
  return comments.map(comment => {
    return {
      author: comment.created_by,
      article_id: articleRef[comment.belongs_to],
      votes: comment.votes,
      created_at: new Date(comment.created_at).toUTCString(),
      body: comment.body
    };
  });
};
