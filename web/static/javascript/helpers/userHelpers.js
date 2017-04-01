const headerWithJWT = () => ({
  Authorization: localStorage.getItem('phoenixAuthToken'),
  Accept: 'application/json',
  'Content-Type': 'application/json',
});

const UserHelpers = {
  headerWithJWT,
}
export default UserHelpers;
