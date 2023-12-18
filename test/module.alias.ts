import ModuleAlias from 'module-alias';
import path from 'path';

ModuleAlias.addAliases({
  '@src': path.join(__dirname, '..'),
  '@utils': path.join(__dirname, '..', 'utils'),
  '@controllers': path.join(__dirname, '..', 'controllers'),
});
