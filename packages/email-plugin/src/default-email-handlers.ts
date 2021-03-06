/* tslint:disable:no-non-null-assertion */
import { AccountRegistrationEvent, IdentifierChangeRequestEvent, OrderStateTransitionEvent, PasswordResetEvent } from '@vendure/core';

import { EmailEventListener } from './event-listener';
import { mockAccountRegistrationEvent, mockEmailAddressChangeEvent, mockOrderStateTransitionEvent, mockPasswordResetEvent } from './mock-events';

export const orderConfirmationHandler = new EmailEventListener('order-confirmation')
    .on(OrderStateTransitionEvent)
    .filter(event => event.toState === 'PaymentSettled' && !!event.order.customer)
    .setRecipient(event => event.order.customer!.emailAddress)
    .setSubject(`Order confirmation for #{{ order.code }}`)
    .setTemplateVars(event => ({ order: event.order }))
    .setMockEvent(mockOrderStateTransitionEvent);

export const emailVerificationHandler = new EmailEventListener('email-verification')
    .on(AccountRegistrationEvent)
    .setRecipient(event => event.user.identifier)
    .setSubject(`Please verify your email address`)
    .setTemplateVars(event => ({ user: event.user }))
    .setMockEvent(mockAccountRegistrationEvent);

export const passwordResetHandler = new EmailEventListener('password-reset')
    .on(PasswordResetEvent)
    .setRecipient(event => event.user.identifier)
    .setSubject(`Forgotten password reset`)
    .setTemplateVars(event => ({ user: event.user }))
    .setMockEvent(mockPasswordResetEvent);

export const emailAddressChangeHandler = new EmailEventListener('email-address-change')
    .on(IdentifierChangeRequestEvent)
    .setRecipient(event => event.user.pendingIdentifier!)
    .setSubject(`Please verify your change of email address`)
    .setTemplateVars(event => ({ user: event.user }))
    .setMockEvent(mockEmailAddressChangeEvent);

export const defaultEmailHandlers = [
    orderConfirmationHandler,
    emailVerificationHandler,
    passwordResetHandler,
    emailAddressChangeHandler,
];
