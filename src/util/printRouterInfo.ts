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
    .sort((a, b) => a[1].localeCompare(b[1]) && a[1].localeCompare(b[1]));

  const pathMap: Record<string, number> = {};
  for (const [, path] of routerPaths) {
    const paths = path.split('/').filter(Boolean);
    for (let i = 0; i < paths.length; i++) {
      const expectedPrefix = paths.slice(0, i).join('/');
      pathMap[expectedPrefix] = (pathMap[expectedPrefix] ?? 0) + 1;
    }
  }

  const newPathMap: Record<string, number> = {};
  for (const [key] of Object.entries(pathMap)) {
    for (let i = 0; i < key.length; i++) {
      if (key[i] === '/') {
        newPathMap[key.slice(0, i)] = (newPathMap[key.slice(0, i)] ?? 0) + 1;
        continue;
      }
    }
  }

  const [firstPath, secondPath] = Object.entries(newPathMap).sort((a, b) => b[1] - a[1]);

  const rootHasNext = secondPath[0].startsWith(firstPath[0]) && firstPath[0] !== secondPath[0];

  const commonPath = !secondPath[0].includes('/') ? firstPath[0] : rootHasNext ? secondPath[0] : '';

  const routerMap = routerPaths.reduce<Record<string, [string, string][]>>((acc, [method, path]) => {
    const group = path.replace('/' + commonPath, '').split('/')[1];
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

  const countText = (count: number) => `${count} route${count > 1 ? 's' : ''}`;

  const routeMapList = Object.entries(routerMap);
  console.log(
    `Route List: ${countText(routeMapList.reduce((acc, [, routes]) => acc + routes.length, 0))} [${routeMapList.length} group${routeMapList.length > 1 ? 's' : ''}]`,
  );
  routeMapList.forEach(([group, routes]) => {
    console.log(`  ${(group === '/' ? '[root]' : group).padEnd(maxGroupLength, ' ')}: ${countText(routes.length)}`);
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
