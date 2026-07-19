/**
 * ==========================================================
 * PATH
 * ==========================================================
 */

class Path {

    constructor(data = {}) {

        this.id = data.id ?? null;

        this.name = data.name ?? "";

        this.description = data.description ?? "";

        this.createdAt = data.created_at ?? null;

    }

    getId() {

        return this.id;

    }

    getName() {

        return this.name;

    }

    getDescription() {

        return this.description;

    }

    setName(name) {

        this.name = name;

    }

    setDescription(description) {

        this.description = description;

    }

    toJSON() {

        return {

            id: this.id,

            name: this.name,

            description: this.description,

            created_at: this.createdAt

        };

    }

}