export interface Address {
  name: string;
  address: string;
}

export interface MailOptions {
  /** The e-mail address of the sender. All e-mail addresses can be plain 'sender@server.com' or formatted 'Sender Name <sender@server.com>' */
  from?: string | Address | undefined;
  /** An e-mail address that will appear on the Sender: field */
  sender?: string | Address | undefined;
  /** Comma separated list or an array of recipients e-mail addresses that will appear on the To: field */
  to?: string | Address | Array<string | Address> | undefined;
  /** Comma separated list or an array of recipients e-mail addresses that will appear on the Cc: field */
  cc?: string | Address | Array<string | Address> | undefined;
  /** Comma separated list or an array of recipients e-mail addresses that will appear on the Bcc: field */
  bcc?: string | Address | Array<string | Address> | undefined;
  /** An e-mail address that will appear on the Reply-To: field */
  replyTo?: string | Address | undefined;
  /** The message-id this message is replying */
  inReplyTo?: string | Address | undefined;
  /** Message-id list (an array or space separated string) */
  references?: string | string[] | undefined;
  /** The subject of the e-mail */
  subject?: string | undefined;
  /** The plaintext version of the message */
  text?: string | undefined;
  /** The HTML version of the message */
  html?: string | undefined;
  /** Apple Watch specific HTML version of the message, same usage as with text and html */
  watchHtml?: string | undefined;
  /** AMP4EMAIL specific HTML version of the message, same usage as with text and html. Make sure it is a full and valid AMP4EMAIL document, otherwise the displaying email client falls back to html and ignores the amp part */
  amp?: string | undefined;
  /** iCalendar event, same usage as with text and html. Event method attribute defaults to ‘PUBLISH’ or define it yourself: {method: 'REQUEST', content: iCalString}. This value is added as an additional alternative to html or text. Only utf-8 content is allowed */
  icalEvent?: string | undefined;
  /** An object or array of additional header fields */
  headers?: Headers | undefined;
  /** optional transfer encoding for the textual parts */
  encoding?: string | undefined;
  /** if set then overwrites entire message output with this value. The value is not parsed, so you should still set address headers or the envelope value for the message to work */
  raw?: string | undefined;
  /** if set to true then fails with an error when a node tries to load content from URL */
  disableUrlAccess?: boolean | undefined;
  /** if set to true then fails with an error when a node tries to load content from a file */
  disableFileAccess?: boolean | undefined;
}

export interface SendEmailConfig {
    token: String,
    mail: MailOptions
}

export interface SendEmailResponse {
    success: boolean
}