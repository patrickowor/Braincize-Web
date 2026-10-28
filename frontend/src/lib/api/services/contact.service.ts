import { http } from "../http";
import { endpoints } from "../endpoints";
import type { AckResponse, ContactMessage } from "../types";

export const contactService = {
  send: (message: ContactMessage) => http.post<AckResponse>(endpoints.contact.send, message),
};
