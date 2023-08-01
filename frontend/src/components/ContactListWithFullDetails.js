// frontend\src\components\ContactListWithFullDetails.js
import React from 'react';
import logger from "loglevel";
import { useGetContactsWithFullDetails } from "../hooks/hooksHub";


export const ContactListWithFullDetails = () => {
    // const {loading, error, data} = useGetCurrentUser();
    //
    // if (loading) return <p>Loading...</p>;
    // if (error) return <p>Error : {error.message} </p>;
    //
    // const contacts = data.getCurrentUser.contacts
    // logger.info(contacts);
    // return (
    //     <div>
    //         <h3> Contacts </h3>
    //         <ul>
    //             {contacts.map(id => (
    //                 <li key={id}>
    //                     <p>id: {id}</p>
    //                 </li>
    //             ))}
    //         </ul>
    //     </div>
    // );
    const { loading, error, data } = useGetContactsWithFullDetails();
    if(loading) return <p>Loading...</p>;
    if(error) return <p>Error : {error.message}</p>;

    const contacts = data.getContactsWithFullDetails;
    logger.info(contacts);
    return (
        <div>
            <h3> Contacts </h3>
            <ul>
                {contacts.map(contact => (
                    <li key={contact.id}>
                        <p>id: {contact.id}</p>
                        <p>email: {contact.email}</p>
                        <p>username: {contact.username}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
