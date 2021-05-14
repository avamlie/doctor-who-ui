"use strict";

const resetDB = require("../config/scripts/populateDB")

const Companion = require("./schema/Companion");
const Doctor = require("./schema/Doctor");

const express = require("express");
const router = express.Router();


// completely resets your database.
// really bad idea irl, but useful for testing
router.route("/reset")
    .get((_req, res) => {
        resetDB(() => {
            res.status(200).send({
                message: "Data has been reset."
            });
        });
    });

router.route("/")
    .get((_req, res) => {
        console.log("GET /");
        res.status(200).send({
            data: "App is running."
        });
    });
    
// ---------------------------------------------------
// Edit below this line
// ---------------------------------------------------
router.route("/doctors")
    .get((req, res) => {
        console.log("GET /doctors");

        // already implemented:
        Doctor.find({})
        .sort('ordering')
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    })
    .post((req, res) => {
        console.log("POST /doctors");
      
        Doctor.create(req.body).save()
            .then(doc => {
                res.status(201).send(doc);
            })
            .catch(()=>{
                res.status(500).send("incorrect new doctor format");
            })
        //res.status(501).send();
    });

// optional:
router.route("/doctors/favorites")
    .get((req, res) => {
        console.log(`GET /doctors/favorites`);

    })
    .post((req, res) => {
        console.log(`POST /doctors/favorites`);
        res.status(501).send();
    });
    
router.route("/doctors/:id")
    .get((req, res) => {
        console.log(`GET /doctors/${req.params.id}`);
        Doctor.findById(req.params.id)
            .then(doc => {
                res.status(200).send(doc);
            })
            .catch(err => {
                res.status(404).send("doctor not found!");
            });

        //res.status(501).send();
    })
    .patch((req, res) => {
        console.log(`PATCH /doctors/${req.params.id}`);
        
        Doctor.findOneAndUpdate({"_id": req.params.id}, req.body, {new: true})
            .then(doc => {
                res.status(200).send(doc);
            })
            .catch(err => {
                res.status(404).send("doctor not found!");
            });
        //res.status(501).send();
    })
    .delete((req, res) => {
        console.log(`DELETE /doctors/${req.params.id}`);
        Doctor.findOneAndDelete({"_id" : req.params.id})
            .then(doc => {
                console.log(doc);
                
                if (doc) {
                    res.status(200).send();
                }
                else {
                    res.status(404).send("could not find doctor");
                }
            })
            .catch(err => {
                console.log(err);
                res.status(404).send(err);
            });
    });
    
router.route("/doctors/:id/companions")

    //invalid doctor not working ???

    .get((req, res) => {
        console.log(`GET /doctors/${req.params.id}/companions`);
        //Doctor.findById(req.params.id)
        let comps = [];
        Companion.find({})
            .then(c => {
                c.forEach(comp => {
                    if (comp.doctors.includes(req.params.id)){
                        comps.push(comp)
                    }
                })
                if (comps.length == 0){
                    res.status(404).send("doctor not found!");
                    return;
                }
                //go through companions and find doc in their doctors list
                res.status(200).send(comps);
            })
            .catch(err => {
                res.status(404).send("doctor not found!");
            })
        //res.status(501).send();
    });
    

router.route("/doctors/:id/goodparent")
//true if every companion who travelled with this doctor is alive; Otherwise, false.
    .get((req, res) => {
        console.log(`GET /doctors/${req.params.id}/goodparent`);
        let lstAlive = [];
        Companion.find({})
            .then(comp => {
                comp.forEach(c => {
                    if (c.doctors.includes(req.params.id)){
                        lstAlive.push(c.alive)
                    }
                })
                if (lstAlive.length == 0){
                    res.status(404).send("doctor not found!");
                }
                //if (lstAlive.every(c => c == true) == false){
                console.log("printing lstAlive");
                console.log(lstAlive);
                res.status(200).send(lstAlive.every(c => c == true));
                //}
            })
            .catch(err => {
                res.status(404).send("doctor not found!");
            });

    });

// optional:
router.route("/doctors/favorites/:doctor_id")
    .delete((req, res) => {
        console.log(`DELETE /doctors/favorites/${req.params.doctor_id}`);
        res.status(501).send();
    });

router.route("/companions")
    .get((req, res) => {
        console.log("GET /companions");
        // already implemented:
        Companion.find({})
        .sort('ordering')
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    })
    .post((req, res) => {
        console.log("POST /companions");
        //let newComp = req.body;
        // if (!req.body.doctors) {
        //     res.status(500).send("no doctors");
        //     return;
        // }
        // if (!req.body.seasons) {
        //     res.status(500).send("no seasons");
        //     return;
        // }
        // if (!req.body.alive) {
        //     res.status(500).send("no alive");
        //     return;
        // }
        // if (!req.body.character) {
        //     res.status(500).send("no character");
        //     return;
        // }
        // if (!req.body.name) {
        //     res.status(500).send("no name");
        //     return;
        // }
        Companion.create(req.body).save()
            .then(c => {
                res.status(201).send(c);
            })
            .catch(()=>{
                res.status(500).send("incorrect new companion format");
            })
        //res.status(501).send();
    });
     


router.route("/companions/crossover")
    //should show all companions that travelled with two or more doctors.
    .get((req, res) => {
        console.log(`GET /companions/crossover`);
        let ans = [];
        Companion.find({})
            .then(c => {
                c.forEach(comp => {
                    if (comp.doctors.length >= 2) {
                        ans.push(comp);
                    }
                })
                res.status(201).send(ans);
            })
            .catch(()=>{
                res.status(400).send("not a companion");
            })
        
    });

// optional:
router.route("/companions/favorites")
    .get((req, res) => {
        console.log(`GET /companions/favorites`);
        res.status(501).send();
    })
    .post((req, res) => {
        console.log(`POST /companions/favorites`);
        res.status(501).send();
    })

router.route("/companions/:id")
    .get((req, res) => {
        console.log(`GET /companions/${req.params.id}`);
        Companion.findById(req.params.id)
            .then(c => {
                res.status(200).send(c);
            })
            .catch(err => {
                res.status(404).send("companion not found!");
            });
        //res.status(501).send();
    })
    .patch((req, res) => {
        console.log(`PATCH /companions/${req.params.id}`);
        Companion.findOneAndUpdate({"_id": req.params.id}, req.body, {new: true})
        .then(c => {
            res.status(200).send(c);
        })
        .catch(err => {
            res.status(404).send("companion not found!");
        });
        //res.status(501).send();
    })
    .delete((req, res) => {
        console.log(`DELETE /companions/${req.params.id}`);
        Companion.findOneAndDelete({"_id" : req.params.id})
            .then(c => {
                console.log(c);
                
                if (c){
                    res.status(200).send();
                }
                else {
                    res.status(404).send("could not find companion");
                }
            })
            .catch(err => {
                console.log(err);
                res.status(404).send(err);
            });
    });

router.route("/companions/:id/doctors")
    .get((req, res) => {
        console.log(`GET /companions/${req.params.id}/doctors`);

        Companion.findById(req.params.id)
        .then(c => {
            let compDoctors = c.doctors;
            console.log("printing here");
            console.log(c);
            console.log(compDoctors);
            let drs = [];
            compDoctors.forEach(d => {
                Doctor.findById(d)
                    .then(doc => {
                        drs.push(doc);
                        console.log("printing length of drs");
                        console.log(drs.length)
                        if (drs.length == compDoctors.length){
                            res.status(200).send(drs)
                            return;
                        }
                    })
                    .catch(err => {
                        res.status(404).send("companion doesn't exist!")
                    })
            })
        })
        .catch(err => {
            res.status(404).send("companion doesn't exist!")
        })
    });

router.route("/companions/:id/friends")
//A list of the companions who appeared on at least one of the same seasons as this companion
    .get((req, res) => {
        console.log(`GET /companions/${req.params.id}/friends`);
        let ans = [];
        Companion.findById(req.params.id)
            .then(comp => {
                let compSeasons = comp.seasons;
                Companion.find({})
                .then( c => {
                    c.forEach(co => {
                        if (co.seasons.some(r => compSeasons.includes(r))){
                            if (co._id != req.params.id){
                            ans.push(co)
                            }
                        }
                    })
                    if (ans.length == 0){
                        res.status(404).send("companion doesn't exist!");
                        return;
                    }
                    res.status(200).send(ans)
                })

            })
            .catch(err => {
                res.status(404).send("companion doesn't exist!");
            })
        //res.status(501).send();
    });

// optional:
router.route("/companions/favorites/:companion_id")
    .delete((req, res) => {
        console.log(`DELETE /companions/favorites/${req.params.companion_id}`);
        res.status(501).send();
    });

module.exports = router;