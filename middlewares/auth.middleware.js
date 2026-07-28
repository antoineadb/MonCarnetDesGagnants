function requireLogin(req, res, next) {

    if (!req.session.user) {

        return res.status(401).json({
            success: false,
            message: "Utilisateur non connecté."
        });

    }

    next();

}

function requireAdmin(req, res, next) {

    if (!req.session.user) {

        return res.status(401).json({
            success: false,
            message: "Utilisateur non connecté."
        });

    }

    if (req.session.user.role !== "admin") {

        return res.status(403).json({
            success: false,
            message: "Accès réservé aux administrateurs."
        });

    }

    next();

}

module.exports = {
    requireLogin,
    requireAdmin
};