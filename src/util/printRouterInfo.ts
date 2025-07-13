import { INestApplication } from '@nestjs/common';

export const printRouterInfo = (app: INestApplication) => {
  const instance = app.getHttpAdapter().getInstance();
  const routers = (instance._router ?? instance.router)['stack'] as { route: { methods: Record<string, any>; path: string } }[];
  const domains = [...(app as any)['container'].modules.values()]
    .filter((module) => module._controllers.size > 0)
    .map((module) => {
      const controller = [...module._controllers][0][0];
      const prefix = Reflect.getMetadata('path', controller);
      return prefix;
    })
    .filter((domain) => Boolean(domain) && domain !== '/');

  const maxGroupLength = routers.reduce((max, { route }) => {
    if (route) {
      const group = route.path.split('/')[1];
      return Math.max(max, group.length);
    }
    return max;
  }, 0);

  const ORDER_METHODS = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'];

  const routerPaths = routers
    .filter(({ route }) => route)
    .map(({ route }) => {
      const method = Object.keys(route.methods)[0];
      return [method.toUpperCase(), route.path];
    })
    .sort((a, b) => a[1].localeCompare(b[1]) && a[1].localeCompare(b[1]))
    .reduce<Record<string, [string, string][]>>((acc, [method, path]) => {
      const group = path.split('/')[1];
      if (domains.includes(group)) {
        if (!acc[group]) {
          acc[group] = [];
        }
        acc[group].push([method, path]);
      } else {
        if (!acc['/']) {
          acc['/'] = [];
        }
        acc['/'].push([method, path]);
      }
      return acc;
    }, {});

  console.log('Route List:');
  Object.entries(routerPaths).forEach(([group, routes]) => {
    console.log(`  ${(group === '/' ? '[root]' : group).padEnd(maxGroupLength, ' ')}: ${routes.length} routes`);
    routes
      .sort((a, b) => ORDER_METHODS.indexOf(a[0]) - ORDER_METHODS.indexOf(b[0]))
      .forEach(([method, path]) => {
        let color = '\x1b[0m';
        switch (method) {
          case 'GET':
            color = '\x1b[32m';
            break;
          case 'POST':
            color = '\x1b[33m';
            break;
          case 'PATCH':
            color = '\x1b[36m';
            break;
          case 'PUT':
            color = '\x1b[34m';
            break;
          case 'DELETE':
            color = '\x1b[31m';
            break;
          default:
            color = '\x1b[0m';
            break;
        }
        console.log(`    ${color}${method.padEnd(2, ' ')}\x1b[0m ${path}`);
      });
  });
};
