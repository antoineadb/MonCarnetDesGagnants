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

        return this.progress?.progress ?? 0;


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

    getMilestoneByCode(code) {
        return this.milestones.find(
            milestone => milestone.getCode() === code
        );
    }

    updateMilestones(id,data){

        const milestone =

            this.getMilestone(id);

        if(!milestone){

            return;

        }

        Object.assign(

            milestone,

            data

        );

    }

    moveMilestone(id,newPosition){

        const milestone =

            this.getMilestone(id);

        if(!milestone){

            return;

        }

        milestone.curve_position =

            newPosition;

    }
}