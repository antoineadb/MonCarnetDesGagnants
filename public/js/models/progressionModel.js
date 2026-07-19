/**
 * ======================================================
 * PROGRESSION MODEL
 * ======================================================
 */

class ProgressionModel {

    constructor(data) {

        this.path = data.path;

        this.milestones = data.milestones.map( milestone => new Milestone(milestone) );

        this.progress = data.state;

    }


    getProgress() {

        return this.progress.progress;

    }

    getPath() {

        return this.path;

    }

    getMilestones() {

        return this.milestones;

    }

    getMilestone(id){

        return this.milestones.find(

            m => m.id === id

        );

    }
    updateMilestones(id,data){

        const milestones =

            this.getMilestones(id);

        if(!milestones){

            return;

        }

        Object.assign(

            milestones,

            data

        );

    }

    moveMilestone(id,newPosition){

        const milestones =

            this.getMilestones(id);

        if(!milestones){

            return;

        }

        milestones.curve_position =

            newPosition;

    }
}