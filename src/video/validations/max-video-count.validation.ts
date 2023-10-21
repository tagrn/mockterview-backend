import { BadRequestException } from '@nestjs/common';
import { UserRole } from '../../user/enums/user-role.enum';
import { MAX_VIDEO_COUNT } from '../enums/max-video-count.enum';

export const maxVideoCountValidate = async (
  videoCount: number,
  role: UserRole,
) => {
  if (role === UserRole.GENERAL) {
    if (videoCount >= MAX_VIDEO_COUNT.GENERAL) {
      throw new BadRequestException(
        `General-user's max video count is ${MAX_VIDEO_COUNT.GENERAL}`,
      );
    }
  }

  if (role === UserRole.STANDARD) {
    if (videoCount >= MAX_VIDEO_COUNT.STANDARD) {
      throw new BadRequestException(
        `Standard-user's max video count is ${MAX_VIDEO_COUNT.STANDARD}`,
      );
    }
  }

  if (role === UserRole.PREMIUM) {
    if (videoCount >= MAX_VIDEO_COUNT.PREMIUM) {
      throw new BadRequestException(
        `Premium-user's max video count is ${MAX_VIDEO_COUNT.PREMIUM}`,
      );
    }
  }

  if (role === UserRole.ADMIN) {
    if (videoCount >= MAX_VIDEO_COUNT.ADMIN) {
      throw new BadRequestException(
        `Admin-user's max video count is ${MAX_VIDEO_COUNT.ADMIN}`,
      );
    }
  }
};
