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

    static async saveProgression(progression){

        const response = await fetch(

            "/api/progression/save",

            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(progression)
            }

        );

        if(!response.ok){

            throw new Error(
                "Impossible d'enregistrer la progression."
            );

        }

        return await response.json();

    }

    /**
    * Charge l'historique d'un jalon
    */
    static async loadHistory(milestoneId){

        const response = await fetch(

            `/api/progression/history/${milestoneId}`

        );

        if(!response.ok){

            throw new Error(
                "Impossible de charger l'historique."
            );

        }

        return await response.json();

    }
}