import { NextApiResponse, NextApiRequest } from 'next';

export default async function exit(req: NextApiRequest, res: NextApiResponse) {
  const { slug = '' } = req.query;
  // get the storyblok params for the bridge to work
  const params = req?.url?.split('?');
  // Exit the current user from "Preview Mode". This function accepts no args.
  res.clearPreviewData();

  // set the cookies to None
  const cookies = res.getHeader('Set-Cookie');
  if (cookies instanceof Array) {
    res.setHeader(
      'Set-Cookie',
      cookies?.map((cookie) => cookie?.replace('SameSite=Lax', 'SameSite=None;Secure'))
    );
  }

  // Redirect to the path from entry
  res.redirect(`/${slug}?${params?.[1]}`);
}
