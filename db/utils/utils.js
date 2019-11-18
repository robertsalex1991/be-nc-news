exports.formatDates = list => {
  if (list.length === 0) return [];
  return list.map(listObj => {
    let cloneObj = { ...listObj };
    let date = new Date(cloneObj.created_at).toUTCString();
    cloneObj.created_at = date;
    return cloneObj;
  });
};

exports.makeRefObj = (data, ref1, ref2) => {
  let obj = {};
  for (let i = 0; i < data.length; i++) {
    let key = data[i][ref1];
    let value = data[i][ref2];
    obj[key] = value;
  }
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
