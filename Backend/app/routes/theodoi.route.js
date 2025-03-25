const express = require('express');
const theodoi = require('../controllers/theodoi.controller');

const router = express.Router();

router.route('/')
    .get(theodoi.findAll)
    .post(theodoi.create)
    .delete(theodoi.deleteAll);

router.route('/:id')
    .get(theodoi.findOne)
    .put(theodoi.update)
    .delete(theodoi.delete);

router.post('/muonsach', theodoi.muonSach);
router.put('/duyet/:id', theodoi.duyetMuonSach);
router.put('/trasach/:id', theodoi.xacNhanTraSach);
module.exports = router;