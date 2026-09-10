export const PERMISSIONS = {
  USER_VIEW:'user.view', USER_CREATE:'user.create', USER_EDIT:'user.edit', USER_DELETE:'user.delete',
  JOB_VIEW:'job.view',   JOB_CREATE:'job.create',   JOB_EDIT:'job.edit',   JOB_DELETE:'job.delete',
  BLOG_VIEW:'blog.view', BLOG_CREATE:'blog.create',  BLOG_EDIT:'blog.edit', BLOG_DELETE:'blog.delete',
}
export const hasPermission = (userPerms = [], perm) => userPerms.includes(perm)
