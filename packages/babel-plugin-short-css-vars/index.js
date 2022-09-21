const ShortCssVars = require('@zonx/short-css-vars');

module.exports = function plugin(api, options) {
  const shortCssVars = new ShortCssVars(options);
  return {
    visitor: {
      TemplateElement: (path) => {
        const raw = shortCssVars.replaceCss(path.node.value.raw);
        path.node.value = {raw};
      },
      JSXAttribute: (path) => {
        if (
          path.node.name.name === 'style' &&
          path.node.value.type === 'JSXExpressionContainer' &&
          path.node.value.expression.type === 'ObjectExpression'
        ) {
          for (const prop of path.node.value.expression.properties) {
            if (prop.key?.value?.startsWith('--')) {
              prop.key.value = shortCssVars.replaceName(prop.key.value);
            }
          }
        }
      },
      StringLiteral: (path) => {
        path.node.value = shortCssVars.replaceCss(path.node.value);
      },
    },
  };
};
