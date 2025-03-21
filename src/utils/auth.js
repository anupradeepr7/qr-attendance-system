export const isStudentLoggedIn = () => {
    if (typeof window !== "undefined") {
        const student = localStorage.getItem("student");
        return student ? JSON.parse(student) : null;
    }
    return null;
};
