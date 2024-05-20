import { ServerResponse, createServer } from 'node:http';
import { addMembers, createProduct, getPermissions, getProducts } from './requests';

const hostname = '127.0.0.1';
const port = parseInt(process.env.PORT || '3000', 10);

const server = createServer();
const buildResponse = (res: ServerResponse, output?: unknown, status = 200) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');

  if (output) {
    res.end(JSON.stringify(output, null, 2));
  } else {
    res.end();
  }
}
const searchProducts = (products: any[], search: string) => {
  const searchLower = search.toLowerCase();
  return products.filter((product) => {
    return product.name?.toLowerCase().includes(searchLower) || product.description?.toLowerCase().includes(searchLower);
  });
}
const urlAddMember = /^\/products\/[a-zA-Z0-9-]+\/members$/;
const urlPermissions = /^\/products\/[a-zA-Z0-9-]+\/permissions$/;


server.on('request', async (req, res) => {
  const [ mainUrl, allQueryParams ] = (req.url ?? '').split('?');
  const params = new URLSearchParams(allQueryParams);
  let body: any = {};
  req.on('data', chunk => {
    body = JSON.parse(chunk || '{}');
  });

  req.on('end', async () => {
    if (mainUrl === '/products' && req.method === 'GET') {
      let products = await getProducts();
      const search = body.search;

      if (search) {
        products = searchProducts(products, search);
      }

      buildResponse(res, products);
      return;
    }
    
    if (mainUrl === '/products' && req.method === 'POST') {
      const name = body.name;

      if (!name) {
        buildResponse(res, { error: 'Name is required' }, 400);
        return;
      }

      const response = await createProduct(name);
      buildResponse(res, response);
      return;
    }

    if (urlAddMember.test(mainUrl) && req.method === 'POST') {
      const productId = mainUrl.split('/')[2];
      const emails = body.emails;
      const permission = body.permission;

      if (!emails) {
        buildResponse(res, { error: 'Property "emails" is required' }, 400);
        return;
      }

      if (!Array.isArray(emails)) {
        buildResponse(res, { error: 'Emails must be an array' }, 400);
        return;
      }

      const response = await addMembers(productId, emails, permission);
      buildResponse(res, response);
      return;
    }

    if (urlPermissions.test(mainUrl) && req.method === 'GET') {
      const productId = mainUrl.split('/')[2];
      
      const response = await getPermissions(productId);
      buildResponse(res, response);
      return;
    }

    buildResponse(res, undefined, 404);
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
