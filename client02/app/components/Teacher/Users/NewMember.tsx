import React, { useState } from "react";
import { Box, Button, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import toast from "react-hot-toast";

type NewMemberProps = {
  onSubmit: (email: string, role: string) => void;
  onCancel: () => void;
};

const NewMember: React.FC<NewMemberProps> = ({ onSubmit, onCancel }) => {
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("user");

  const handleAddMember = () => {
    if (!email || !role) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    onSubmit(email, role);
    setEmail("");
    setRole("user");
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "400px",
        padding: "20px",
        margin: "20px auto",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 className="text-lg font-bold text-center mb-4">Thêm Thành Viên</h2>
      <form>
        {/* Email Field */}
        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />

        {/* Role Selection */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Vai Trò</InputLabel>
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItem value="user">Người dùng</MenuItem>
            <MenuItem value="admin">Quản trị viên</MenuItem>
            <MenuItem value="teacher">Giảng viên</MenuItem>
          </Select>
        </FormControl>

        {/* Action Buttons */}
        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button
            variant="outlined"
            color="error"
            onClick={onCancel}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddMember}
          >
            Thêm Thành Viên
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default NewMember;
