const groups = new Map();  
const inflight = new Map(); 

function getCached(jid) {
  return groups.get(jid);
}
 function setCached(jid, metadata) {
  if (!jid || !metadata) return;
  groups.set(jid, metadata);
}
function deleteCached(jid) {
  groups.delete(jid);
  inflight.delete(jid);
}
function listCachedJids() {
  return Array.from(groups.keys());
}
async function getGroupMetadata(conn, jid) {
  const cached = groups.get(jid);
  if (cached) return cached;
  if (inflight.has(jid)) return inflight.get(jid);
  const p = (async () => {
    try {
      const md = await conn.groupMetadata(jid);
      groups.set(jid, md);
      return md;
    } catch (err) {
      groups.delete(jid);
      throw err;
    } finally {
      inflight.delete(jid);
    }
  })();
  inflight.set(jid, p);
  return p;
}
function updateCached(jid, updateObj) {
  if (!jid || !updateObj) return;
  const cached = groups.get(jid) || {};
  groups.set(jid, { ...cached, ...updateObj });
}

module.exports = {
  groups,
  getCached,
  setCached,
  deleteCached,
  listCachedJids,
  getGroupMetadata,
  updateCached
};