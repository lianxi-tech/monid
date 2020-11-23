import Koa from 'koa';
import Router from '@koa/router';
import { Resolver } from 'did-resolver';
import { getResolver } from '@monid/did-resolver';

const app = new Koa();
const router = new Router();

// healthz
router.get('/', (ctx) => {
  ctx.body = 'alive';
});

// did resolve
router.get('/1.0/identifiers/:did', async (ctx) => {
  const did = ctx.params.did;
  if (!verifyDIDFormat(did)) {
    ctx.status = 400;
    return;
  }

  const resolver = new Resolver(getResolver());
  const didDocument = await resolver.resolve(did);
  if (didDocument) ctx.body = didDocument;
  else ctx.status = 400;
});

app.use(router.routes());
app.listen(process.env.PORT || 3000, () => {
  console.log(`server runs at :${process.env.PORT || 3000}`);
});

function verifyDIDFormat(did: string) {
  return /^did:monid:[0-9a-fA-F]{64}$/.test(did);
}
