// Local identity helper for the supplied, self-contained scene metadata.
export function defineVideoMeta<const T extends Record<string, unknown>>(meta: T): T {
  return meta;
}
