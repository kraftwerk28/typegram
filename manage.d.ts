import { Location, Message, PhotoSize } from "./message";

/** Contains information about the current status of a webhook. */
export interface WebhookInfo {
  /** Webhook URL, may be empty if webhook is not set up */
  url?: string;
  /** True, if a custom certificate was provided for webhook certificate checks */
  has_custom_certificate: boolean;
  /** Number of updates awaiting delivery */
  pending_update_count: number;
  /** Currently used webhook IP address */
  ip_address?: string;
  /** Unix time for the most recent error that happened when trying to deliver an update via webhook */
  last_error_date: number;
  /** Error message in human-readable format for the most recent error that happened when trying to deliver an update via webhook */
  last_error_message: string;
  /** Maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery */
  max_connections: number;
  /** A list of update types the bot is subscribed to. Defaults to all update types except chat_member */
  allowed_updates: string[];
}

/** This object represents a Telegram user or bot. */
export interface User {
  /** Unique identifier for this user or bot. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier. */
  id: number;
  /** True, if this user is a bot */
  is_bot: boolean;
  /** User's or bot's first name */
  first_name: string;
  /** User's or bot's last name */
  last_name?: string;
  /** User's or bot's username */
  username?: string;
  /** IETF language tag of the user's language */
  language_code?: string;
}

/** This object represents a Telegram user or bot that was returned by `getMe`. */
export interface UserFromGetMe extends User {
  is_bot: true;
  username: string;
  /** True, if the bot can be invited to groups. Returned only in getMe. */
  can_join_groups: boolean;
  /** True, if privacy mode is disabled for the bot. Returned only in getMe. */
  can_read_all_group_messages: boolean;
  /** True, if the bot supports inline queries. Returned only in getMe. */
  supports_inline_queries: boolean;
}

export namespace Chat {
  // ABSTRACT
  /** Internal type holding properties that all kinds of chats share. */
  interface AbstractChat {
    /** Type of chat, can be either “private”, “group”, “supergroup” or “channel” */
    type: string;
    /** Unique identifier for this chat. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier. */
    id: number;
  }

  // HELPERS
  /** Internal type holding properties that those chats with user names share. */
  interface UserNameChat {
    /** Username, for private chats, supergroups and channels if available */
    username?: string;
  }
  /** Internal type holding properties that those chats with titles share. */
  interface TitleChat {
    /** Title, for supergroups, channels and group chats */
    title: string;
  }

  // ==> CHATS
  /** Internal type representing private chats. */
  export interface PrivateChat extends AbstractChat, UserNameChat {
    type: "private";
    /** First name of the other party in a private chat */
    first_name: string;
    /** Last name of the other party in a private chat */
    last_name?: string;
  }
  /** Internal type representing group chats. */
  export interface GroupChat extends AbstractChat, TitleChat {
    type: "group";
  }
  /** Internal type representing super group chats. */
  export interface SupergroupChat
    extends AbstractChat,
      UserNameChat,
      TitleChat {
    type: "supergroup";
  }
  /** Internal type representing channel chats. */
  export interface ChannelChat extends AbstractChat, UserNameChat, TitleChat {
    type: "channel";
  }

  // GET CHAT HELPERS
  /** Internal type holding properties that those chats returned from `getChat` share. */
  interface GetChat {
    /** Chat photo. Returned only in getChat. */
    photo?: ChatPhoto;
    /** The most recent pinned message (by sending date). Returned only in getChat. */
    pinned_message?: Message;
    /** The time after which all messages sent to the chat will be automatically deleted; in seconds. Returned only in getChat. */
    message_auto_delete_time?: number;
  }
  /** Internal type holding properties that those group, supergroup, and channel chats returned from `getChat` share. */
  interface NonPrivateGetChat extends GetChat {
    /** Description, for groups, supergroups and channel chats. Returned only in getChat. */
    description?: string;
    /** Primary invite link, for groups, supergroups and channel chats. Returned only in getChat. */
    invite_link?: string;
  }
  /** Internal type holding properties that those group and supergroup chats returned from `getChat` share. */
  interface MultiUserGetChat extends NonPrivateGetChat {
    /** Default chat member permissions, for groups and supergroups. Returned only in getChat. */
    permissions?: ChatPermissions;
    /** True, if the bot can change the group sticker set. Returned only in getChat. */
    can_set_sticker_set?: boolean;
  }
  /** Internal type holding properties that those supergroup and channel chats returned from `getChat` share. */
  interface LargeGetChat extends NonPrivateGetChat {
    /** Unique identifier for the linked chat, i.e. the discussion group identifier for a channel and vice versa; for supergroups and channel chats. This identifier may be greater than 32 bits and some programming languages may have difficulty/silent defects in interpreting it. But it is smaller than 52 bits, so a signed 64 bit integer or double-precision float type are safe for storing this identifier. Returned only in getChat. */
    linked_chat_id?: number;
  }

  // ==> GET CHATS
  /** Internal type representing private chats returned from `getChat`. */
  export interface PrivateGetChat extends PrivateChat, GetChat {
    /** Bio of the other party in a private chat. Returned only in getChat. */
    bio?: string;
  }
  /** Internal type representing group chats returned from `getChat`. */
  export interface GroupGetChat extends GroupChat, MultiUserGetChat {}
  /** Internal type representing supergroup chats returned from `getChat`. */
  export interface SupergroupGetChat
    extends SupergroupChat,
      MultiUserGetChat,
      LargeGetChat {
    /** For supergroups, the minimum allowed delay between consecutive messages sent by each unprivileged user. Returned only in getChat. */
    slow_mode_delay?: number;
    /** For supergroups, name of group sticker set. Returned only in getChat. */
    sticker_set_name?: string;
    /** For supergroups, the location to which the supergroup is connected. Returned only in getChat. */
    location?: ChatLocation;
  }
  /** Internal type representing channel chats returned from `getChat`. */
  export interface ChannelGetChat extends ChannelChat, LargeGetChat {}
}

/** This object represents a chat. */
export type Chat =
  | Chat.PrivateChat
  | Chat.GroupChat
  | Chat.SupergroupChat
  | Chat.ChannelChat;

/** This object represents a Telegram user or bot that was returned by `getChat`. */
export type ChatFromGetChat =
  | Chat.PrivateGetChat
  | Chat.GroupGetChat
  | Chat.SupergroupGetChat
  | Chat.ChannelGetChat;

/** This object represent a user's profile pictures. */
export interface UserProfilePhotos {
  /** Total number of profile pictures the target user has */
  total_count: number;
  /** Requested profile pictures (in up to 4 sizes each) */
  photos: PhotoSize[][];
}

/** This object represents a chat photo. */
export interface ChatPhoto {
  /** File identifier of small (160x160) chat photo. This file_id can be used only for photo download and only for as long as the photo is not changed. */
  small_file_id: string;
  /** Unique file identifier of small (160x160) chat photo, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. */
  small_file_unique_id: string;
  /** File identifier of big (640x640) chat photo. This file_id can be used only for photo download and only for as long as the photo is not changed. */
  big_file_id: string;
  /** Unique file identifier of big (640x640) chat photo, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. */
  big_file_unique_id: string;
}

/** Represents an invite link for a chat. */
export interface ChatInviteLink {
  /** The invite link. If the link was created by another chat administrator, then the second part of the link will be replaced with “…”. */
  invite_link: string;
  /** Creator of the link */
  creator: User;
  /** True, if the link is primary */
  is_primary: boolean;
  /** True, if the link is revoked */
  is_revoked: boolean;
  /** Point in time (Unix timestamp) when the link will expire or has been expired */
  expire_date?: number;
  /** Maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999 */
  member_limit?: number;
}

/** This object contains information about one member of a chat. */
export interface ChatMember {
  /** Information about the user */
  user: User;
  /** The member's status in the chat. Can be “creator”, “administrator”, “member”, “restricted”, “left” or “kicked” */
  status:
    | "creator"
    | "administrator"
    | "member"
    | "restricted"
    | "left"
    | "kicked";
  /** Owner and administrators only. Custom title for this user */
  custom_title?: string;
  /** Owner and administrators only. True, if the user's presence in the chat is hidden */
  is_anonymous?: boolean;
  /** Administrators only. True, if the bot is allowed to edit administrator privileges of that user */
  can_be_edited?: boolean;
  /** Administrators only. True, if the administrator can access the chat event log, chat statistics, message statistics in channels, see channel members, see anonymous administrators in supergroups and ignore slow mode. Implied by any other administrator privilege */
  can_manage_chat?: boolean;
  /** Administrators only. True, if the administrator can post in the channel; channels only */
  can_post_messages?: boolean;
  /** Administrators only. True, if the administrator can edit messages of other users and can pin messages; channels only */
  can_edit_messages?: boolean;
  /** Administrators only. True, if the administrator can delete messages of other users */
  can_delete_messages?: boolean;
  /** Administrators only. True, if the administrator can manage voice chats */
  can_manage_voice_chats?: boolean;
  /** Administrators only. True, if the administrator can restrict, ban or unban chat members */
  can_restrict_members?: boolean;
  /** Administrators only. True, if the administrator can add new administrators with a subset of their own privileges or demote administrators that he has promoted, directly or indirectly (promoted by administrators that were appointed by the user) */
  can_promote_members?: boolean;
  /** Administrators and restricted only. True, if the user is allowed to change the chat title, photo and other settings */
  can_change_info?: boolean;
  /** Administrators and restricted only. True, if the user is allowed to invite new users to the chat */
  can_invite_users?: boolean;
  /** Administrators and restricted only. True, if the user is allowed to pin messages; groups and supergroups only */
  can_pin_messages?: boolean;
  /** Restricted only. True, if the user is a member of the chat at the moment of the request */
  is_member?: boolean;
  /** Restricted only. True, if the user is allowed to send text messages, contacts, locations and venues */
  can_send_messages?: boolean;
  /** Restricted only. True, if the user is allowed to send audios, documents, photos, videos, video notes and voice notes */
  can_send_media_messages?: boolean;
  /** Restricted only. True, if the user is allowed to send polls */
  can_send_polls?: boolean;
  /** Restricted only. True, if the user is allowed to send animations, games, stickers and use inline bots */
  can_send_other_messages?: boolean;
  /** Restricted only. True, if the user is allowed to add web page previews to their messages */
  can_add_web_page_previews?: boolean;
  /** Restricted and kicked only. Date when restrictions will be lifted for this user; unix time */
  until_date?: number;
}

/** This object represents changes in the status of a chat member. */
export interface ChatMemberUpdated {
  /** Chat the user belongs to */
  chat: Chat;
  /** Performer of the action, which resulted in the change */
  from: User;
  /** Date the change was done in Unix time */
  date: number;
  /** Previous information about the chat member */
  old_chat_member: ChatMember;
  /** New information about the chat member */
  new_chat_member: ChatMember;
  /** Chat invite link, which was used by the user to join the chat; for joining by invite link events only. */
  invite_link?: ChatInviteLink;
}

/** Describes actions that a non-administrator user is allowed to take in a chat. */
export interface ChatPermissions {
  /** True, if the user is allowed to send text messages, contacts, locations and venues */
  can_send_messages?: boolean;
  /** True, if the user is allowed to send audios, documents, photos, videos, video notes and voice notes, implies can_send_messages */
  can_send_media_messages?: boolean;
  /** True, if the user is allowed to send polls, implies can_send_messages */
  can_send_polls?: boolean;
  /** True, if the user is allowed to send animations, games, stickers and use inline bots, implies can_send_media_messages */
  can_send_other_messages?: boolean;
  /** True, if the user is allowed to add web page previews to their messages, implies can_send_media_messages */
  can_add_web_page_previews?: boolean;
  /** True, if the user is allowed to change the chat title, photo and other settings. Ignored in public supergroups */
  can_change_info?: boolean;
  /** True, if the user is allowed to invite new users to the chat */
  can_invite_users?: boolean;
  /** True, if the user is allowed to pin messages. Ignored in public supergroups */
  can_pin_messages?: boolean;
}

/** Represents a location to which a chat is connected. */
export interface ChatLocation {
  /** The location to which the supergroup is connected. Can't be a live location. */
  location: Location;
  /** Location address; 1-64 characters, as defined by the chat owner */
  address: string;
}

/** This object represents a bot command. */
export interface BotCommand {
  /** Text of the command, 1-32 characters. Can contain only lowercase English letters, digits and underscores. */
  command: string;
  /** Description of the command, 3-256 characters. */
  description: string;
}

/** This object represents a file ready to be downloaded. The file can be downloaded via the link https://api.telegram.org/file/bot<token>/<file_path>. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling getFile. */
export interface File {
  /** Identifier for this file, which can be used to download or reuse the file */
  file_id: string;
  /** Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. */
  file_unique_id: string;
  /** File size, if known */
  file_size?: number;
  /** File path. Use https://api.telegram.org/file/bot<token>/<file_path> to get the file. */
  file_path?: string;
}
