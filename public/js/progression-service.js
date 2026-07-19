class ProgressionService {

    /**
     * Charge un parcours
     */
    static async load(pathId = 1) {

        const response = await fetch(

            `/api/progression/${pathId}`

        );

        if (!response.ok) {

            throw new Error(

                "Impossible de charger le parcours."

            );

        }

        return await response.json();

    }

    /**
     * Sauvegarde la progression
     */
    static async saveProgress(pathId, progress) {

        const response = await fetch(

            "/api/progression/state",

            {

                method: "PUT",

                headers: {

                    "Content-Type":"application/json"

                },

                body: JSON.stringify({

                    pathId,

                    progress

                })

            }

        );

        return await response.json();

    }

}