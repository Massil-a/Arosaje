import { Request, Response } from "express";
import { CommentInstance } from "../models/Comment";
import { PostInstance } from "../models/Post";
import { UserInstance } from "../models/User";

class CommentController {
  async create(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[0];
      const user = await UserInstance.findOne({ where: { uid: token } });
      if (!user) return res.status(404).json({ success: false, msg: "Utilisateur non conforme" });
      const { idPost } = req.body;

      const post = await PostInstance.findOne({ where: { idPosts: idPost } });
      if (!post) return res.status(404).json({ success: false, msg: "Post non trouvé" });

      const record = await CommentInstance.create({...req.body,idUser: user.dataValues.idUsers});
      return res.status(200).json({ success: true, record, msg: "Création commentaire ok" });
    } catch (e) {
      console.error(e);
      return res.status(417).json({ success: false, msg: "Création commentaire échouée" });
    }
  }

  async readPagination(req: Request, res: Response) {
    try {
      const quantite = parseInt(req.query.quantite as string, 10) || 10;
      const saut = parseInt(req.query.saut as string, 10) || 0;
      const records = await CommentInstance.findAll({ where: {}, limit: quantite, offset: saut });
      return res.status(200).json({ success: true, records });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, msg: "Lecture échouée" });
    }
  }

  async readByPost(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const comments = await CommentInstance.findAll({ where: { idPost: id } });
      if (comments.length === 0) return res.status(404).json({ msg: "Aucun commentaire trouvé pour ce post" });
      return res.status(200).json({ success: true, comments });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, msg: "Erreur lors de la lecture" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const token = req.headers.authorization?.split(" ")[0];
      if (!token) return res.status(200).json({ success: true, msg: "Aucun token fourni" });
      const user = await UserInstance.findOne({ where: { uid: token } });
      if (!user)
        return res.status(404).json({ success: false, msg: "Utilisateur introuvable" });
      const record = await CommentInstance.findOne({where: { idComments: id } });
      if (!record)
        return res.status(404).json({ success: false, msg: "Commentaire introuvable" });

      // // Vérifier si le post associé au commentaire existe
      // const post = await PostInstance.findOne({ where: { idPosts: record.dataValues.idPost } });
      // if (!post) return res.status(404).json({ msg: "Post associé au commentaire non trouvé" });

      if ( user.dataValues.isAdmin || user.dataValues.idUsers === record.dataValues.idUser) {
        await record.destroy();
        return res.status(200).json({ success: true, msg: "Commentaire bien supprimé" });
      } else {
        return res.status(413).json({ success: false, msg: "Droits requis" });
      }
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, msg: "Erreur lors de la suppression" });
    }
  }
}

export default new CommentController();
