export const serializePublicUser = (user) => {
    if (!user) {
        return user
    }

    const publicUser = { ...user }

    delete publicUser.password

    return publicUser
}
