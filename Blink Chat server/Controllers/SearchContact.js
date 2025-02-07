import User from "../models/UserModel.js"; // Import the User model


// searchContacts function take Firstname as request and find user in database by it's firtname.
export const searchContacts = async (request, response) => {
    try {
        const { firstName } = request.body;

        if (!firstName) {
            return response.status(400).json({ message: "Please Enter NAME to find contact" });
        }

        const contacts = await User.find({
            firstName: { $regex: `^${firstName}`, $options: "i" }
        });

        if (contacts.length === 0) {
            return response.status(404).json({ message: "User with the given name is not found" });
        }
        return response.status(200).json({contacts});
    } catch (err) {
        console.error(err);
        return response.status(500).send("Internal server error");
    }
};

