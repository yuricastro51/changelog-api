import { AuthUseCase } from 'src/domain/interfaces/authUseCase';
import { EmailValidator } from 'src/domain/interfaces/emailValidator';
import { HttpRequestType } from 'src/utils/types';
import HttpResponse from '../helpers/httpResponse';
import InvalidParamError from '../helpers/invalidParamError';
import MissingParamError from '../helpers/missingParamError';

export default class LoginRouter {
	authUseCase: AuthUseCase;
	emailValidator: EmailValidator;

	constructor(authUseCase: AuthUseCase, emailValidator: EmailValidator) {
		this.authUseCase = authUseCase;
		this.emailValidator = emailValidator;
	}
	async route(httpRequest: HttpRequestType) {
		try {
			const { email, password } = httpRequest.body;

			if (!email) {
				return HttpResponse.badRequest(new MissingParamError('email'));
			}

			if (!this.emailValidator.isValid(email)) {
				return HttpResponse.badRequest(new InvalidParamError('email'));
			}

			if (!password) {
				return HttpResponse.badRequest(new MissingParamError('password'));
			}

			const accessToken = await this.authUseCase.auth(email, password);

			if (!accessToken) {
				return HttpResponse.unauthorizedError();
			}

			return HttpResponse.ok({ accessToken });
		} catch (error) {
			return HttpResponse.serverError();
		}
	}
}
