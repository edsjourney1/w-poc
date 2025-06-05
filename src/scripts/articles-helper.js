const ArticleHelper = (x, y) => {
  this.x = x;
  this.y = y;
  this.init = () => {
    console.log('---------------', x);
    console.log('---------------', y);
  };
};

export default ArticleHelper;
