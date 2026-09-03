const normalize = (value = '') => value.toLowerCase().trim();

const getReply = (message, role) => {
  const text = normalize(message);
  const isAdmin = role === 'admin';

  if (/hello|hi|hey|good morning|good afternoon/.test(text)) {
    return `Hi! I can help with ${isAdmin ? 'employees, departments, leave, salary, and attendance.' : 'your profile, leave, salary, and attendance.'}`;
  }

  if (/leave|vacation|time off|holiday/.test(text)) {
    return isAdmin
      ? 'You can review and manage requests from Admin Dashboard > Leaves. Open a request to see its details and status.'
      : 'You can view your leave history from Employee Dashboard > Leaves. Contact your administrator if you need to request time off.';
  }

  if (/salary|pay|payroll|payslip/.test(text)) {
    return isAdmin
      ? 'Use Admin Dashboard > Salary to add or review employee salary records.'
      : 'Your salary records are available in Employee Dashboard > Salary. If something looks incorrect, contact your administrator.';
  }

  if (/attendance|present|absent|check.?in/.test(text)) {
    return isAdmin
      ? 'Use Admin Dashboard > Attendance for attendance entries and Attendance Report for a broader view.'
      : 'Your attendance summary is available from the employee dashboard. Ask your administrator about corrections.';
  }

  if (/profile|account|password|setting/.test(text)) {
    return isAdmin
      ? 'Open Settings to update your administrator profile. Use Forgot password on the login screen to reset access.'
      : 'Open Profile or Settings to manage your account details. Use Forgot password on the login screen if you cannot sign in.';
  }

  if (isAdmin && /employee|staff|team/.test(text)) {
    return 'Use Admin Dashboard > Employees to add, edit, and view employee records.';
  }

  if (isAdmin && /department/.test(text)) {
    return 'Use Admin Dashboard > Departments to create, edit, and review departments.';
  }

  return `I can help with ${isAdmin ? 'employees, departments, leaves, salary, attendance, and settings' : 'leaves, salary, attendance, profile, and settings'}. Try asking about one of those topics.`;
};

export const sendChatbotMessage = (req, res) => {
  const { message } = req.body;

  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ success: false, message: 'Please enter a message.' });
  }

  return res.json({
    success: true,
    reply: getReply(message, req.user.role),
  });
};