import { SetMetadata } from '@nestjs/common';

// here is the way that we could create our customize decorator since
// the decorator will contain a meta data to tell to nestjs
export const IS_PUBIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBIC_KEY, true);
