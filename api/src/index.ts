import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { Request, Response } from 'express-serve-static-core';
import { ReleaseNote } from './entity/ReleaseNote';
import { getMyConnection } from './services/db';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/release', async (req: Request, res: Response) => {
	const { version, description } = req.body;

	const connection = await getMyConnection();

	const repository = connection.getRepository(ReleaseNote);

	const changelog = new ReleaseNote();
	changelog.version = version;
	changelog.releaseDate = new Date();
	changelog.description = description;

	const { identifiers } = await repository.insert(changelog);

	const [{ uuid }] = identifiers;

	res.send({ uuid: uuid });
});

app.get('/release', async (req: Request, res: Response) => {
	const connection = await getMyConnection();

	const repository = connection.getRepository(ReleaseNote);

	const releases = await repository.find();

	res.send(releases);
});

app.get('/release/:uuid', async (req: Request, res: Response) => {
	const { uuid } = req.params;

	if (!uuid) {
		res.status(400).send('uuid não encontrado.');
	}

	const connection = await getMyConnection();

	const repository = connection.getRepository(ReleaseNote);

	const release = await repository.findOne(uuid);

	res.send(release);
});

app.listen(process.env.PORT);

console.log('Listen on ' + process.env.PORT);
