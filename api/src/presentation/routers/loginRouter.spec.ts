type Login = {
	email: string;
	password: string;
};

type HttpRequest = {
	body: Login;
};

type HttpResponse = {
	statusCode: number;
};

class LoginRouter {
	route(httpRequest: HttpRequest) {
		if (!httpRequest.body.email) {
			return {
				statusCode: 400,
			};
		}

		return { statusCode: 200 };
	}
}

describe('Login Router', () => {
	test('Should return 400 if no email is provided', () => {
		const sut = new LoginRouter();
		const httpRequest = {
			body: {
				password: 'any_password',
				email: '',
			},
		};

		const httpResponse: HttpResponse = sut.route(httpRequest);

		expect(httpResponse.statusCode).toBe(200);
	});
});
