const db = require('./../models');
const Works = db.works
const fs = require('fs');
const path = require('path');

exports.findAll = async (req, res) =>  {
	const works = await Works.findAll({include: 'category'});
	return res.status(200).json(works);
}

exports.create = async (req, res) => {
	const host = req.get('host');
	const title = req.body.title;
	const categoryId = req.body.category;
	const userId = req.auth.userId;
	const imageUrl = `${req.protocol}://${host}/images/${req.file.filename}`;
	try{
		const work = await Works.create({
			title,
			imageUrl,
			categoryId,
			userId
		})
		return res.status(201).json(work)
	}catch (err) {
		return res.status(500).json({ error: new Error('Something went wrong') })
	}
}

exports.delete = async (req, res) => {
	try{
		const work = await Works.findOne({where: {id: req.params.id}});
		if (!work) return res.status(404).json({error: 'Work not found'});

		const filename = path.basename(work.imageUrl);
		const filepath = path.join(__dirname, '..', 'images', filename);
		fs.unlink(filepath, () => {});

		await work.destroy();
		return res.status(204).json({message: 'Work Deleted Successfully'})
	}catch(e){
		return res.status(500).json({error: new Error('Something went wrong')})
	}
}
