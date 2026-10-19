declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    LOCAL_ADMIN_PASSWORD?: string;
    BUCKET?: R2Bucket;
  }
}
