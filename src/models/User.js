export const UserModel = {
  id: null, email: '', first_name: '', last_name: '', phone: '',
  role: '', status: 'active', avatar: '', date_joined: '', last_login: '',
}
export const createUserPayload = (data) => ({
  email: data.email, first_name: data.first_name, last_name: data.last_name,
  phone: data.phone, role: data.role, status: data.status,
})
