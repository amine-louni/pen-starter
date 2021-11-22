

import { cathAsync } from '../helpers/catchAsync';
import { User } from '../entities/User';
import AppError from '../helpers/AppError';
import { ALLOWED_USER_FIELDS_TO_UPDATE, FORBIDDEN_USER_FIELDS_TO_UPDATE, NOT_FOUND } from '../constatns';
import { getRepository } from 'typeorm';






export const getUser = cathAsync(async (req, res, next) => {

    const { uuid } = req.params;
    console.log(uuid, 'uuid')
    // 1 ) find the user  &  check if exists    

    const theUser = await User.findOne({ uuid: uuid });
    console.log(theUser, 'the user')
    if (!theUser) {
        return next(new AppError('user not found', 404, NOT_FOUND));
    }







    // 3) Ok !
    return res.json({
        status: 'success',
        user: theUser
    })

})


export const updateMe = cathAsync(async (req, res, next) => {
    const { body } = req;
    const userRepository = getRepository(User);
    // 1) Create error if user POSTs password data
    if (req.body.password) {
        return next(
            new AppError(
                'This route is not for password updates. Please use /updateMyPassword.',
                400
            )
        );
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    Object.keys(body).forEach((bodyKey: any) => {
        if (!ALLOWED_USER_FIELDS_TO_UPDATE.includes(bodyKey)) {
            delete body[bodyKey]
        }
    })


    //  2 ) Update the user

    await User.update({ uuid: req.currentUser?.uuid! }, {
        ...body
    }, {

    }).then(response => console.log(response)).catch((e) => next(
        new AppError(
            `error while updating : ${e}`,
            500
        )
    ))

    const updatedUser = await User.findOne({ uuid: req.currentUser?.uuid })








    // 3) Ok !
    return res.json({
        status: 'success',
        user: updatedUser

    })

})


