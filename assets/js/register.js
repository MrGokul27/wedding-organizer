/* ── Helpers ── */
function showError(field, errorEl, msg) {
  field.classList.remove("is-valid");
  field.classList.add("is-invalid");
  if (msg) {
    const span = errorEl.querySelector("[id$='-error-msg']");
    if (span) span.textContent = msg;
  }
  errorEl.classList.add("show");
}

function clearError(field) {
  field.classList.remove("is-invalid");

  const errorEl = document.getElementById(field.id + "-error");
  if (errorEl) {
    errorEl.classList.remove("show");
  }
}

function markValid(field) {
  field.classList.remove("is-invalid");
  field.classList.add("is-valid");
}

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

/* ── Block numbers & special chars in name fields ── */
["firstName", "lastName"].forEach((id) => {
  const el = document.getElementById(id);
  el.addEventListener("keypress", (e) => {
    if (!/[a-zA-Z\s\-']/.test(e.key)) e.preventDefault();
  });
  el.addEventListener("input", () => {
    el.value = el.value.replace(/[^a-zA-Z\s\-']/g, "");
  });
});

/* ── Password toggle ── */
function makeToggle(btnId, inputId) {
  const btn = document.getElementById(btnId);
  const inp = document.getElementById(inputId);
  if (!btn || !inp) return;
  btn.addEventListener("click", () => {
    const isPwd = inp.type === "password";
    inp.type = isPwd ? "text" : "password";
    btn.querySelector("span").textContent = isPwd
      ? "visibility_off"
      : "visibility";
  });
}
makeToggle("togglePass", "password");
makeToggle("toggleConfirm", "confirmPassword");

/* ── Password strength ── */
const strengthColors = {
  1: "#e74c3c",
  2: "#e67e22",
  3: "#f1c40f",
  4: "#2ecc71",
};
const strengthLabels = {
  1: "Weak — add numbers & symbols",
  2: "Fair — getting better",
  3: "Good — almost there",
  4: "Strong — well protected",
};

function calcStrength(v) {
  let score = 0;
  if (v.length >= 8) score++;
  if (/[A-Z]/.test(v)) score++;
  if (/[0-9]/.test(v)) score++;
  if (/[^A-Za-z0-9]/.test(v)) score++;
  return score;
}

document.getElementById("password").addEventListener("input", function () {
  const val = this.value;
  const score = val.length ? calcStrength(val) : 0;
  const segs = document.querySelectorAll(".strength-seg");
  const label = document.getElementById("strengthLabel");

  segs.forEach((s, i) => {
    s.style.background =
      i < score ? strengthColors[score] : "var(--outline-variant)";
  });

  label.textContent = val.length ? strengthLabels[score] : "";
  label.style.color = val.length
    ? strengthColors[score]
    : "var(--outline-variant)";

  // Live match check
  checkMatch();
  updatePills();
});

/* ── Confirm password live match ── */
function checkMatch() {
  const pwd = document.getElementById("password").value;
  const conf = document.getElementById("confirmPassword").value;
  const ind = document.getElementById("matchIndicator");
  const icon = document.getElementById("matchIcon");
  const text = document.getElementById("matchText");

  if (!conf) {
    ind.classList.remove("show", "match", "no-match");
    return;
  }

  ind.classList.add("show");
  if (pwd === conf) {
    ind.classList.add("match");
    ind.classList.remove("no-match");
    icon.textContent = "check_circle";
    text.textContent = "Passwords match";
  } else {
    ind.classList.add("no-match");
    ind.classList.remove("match");
    icon.textContent = "cancel";
    text.textContent = "Passwords do not match";
  }
}

document
  .getElementById("confirmPassword")
  .addEventListener("input", checkMatch);

/* ── Progress pills ── */
function updatePills() {
  const fn = document.getElementById("firstName").value.trim();
  const ln = document.getElementById("lastName").value.trim();
  const role = document.querySelector('input[name="role"]:checked');
  const em = document.getElementById("email").value.trim();
  const pwd = document.getElementById("password").value;
  const conf = document.getElementById("confirmPassword").value;
  const trms = document.getElementById("terms").checked;

  const p1 = fn && ln && role;
  const p2 = p1 && em;
  const p3 = p2 && pwd && conf && trms;

  document.getElementById("pill1").className =
    "step-pill" + (p1 ? " done" : " active");
  document.getElementById("pill2").className =
    "step-pill" + (p2 ? " done" : p1 ? " active" : "");
  document.getElementById("pill3").className =
    "step-pill" + (p3 ? " done" : p2 ? " active" : "");
}

document.querySelectorAll(".aura-input").forEach((el) => {
  el.addEventListener("input", updatePills);
});
document.querySelectorAll('input[name="role"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    document.getElementById("role-error").classList.remove("show");
  });
});
document.getElementById("terms").addEventListener("change", function () {
  if (this.checked) {
    document.getElementById("terms-error").classList.remove("show");
  }
});

/* ── Focus micro-interaction ── */
document.querySelectorAll(".aura-input").forEach((el) => {
  el.addEventListener("focus", () => {
    el.closest(".input-wrap").style.transform = "scale(1.005)";
  });
  el.addEventListener("blur", () => {
    el.closest(".input-wrap").style.transform = "scale(1)";
  });
  el.addEventListener("input", () => clearError(el));
});

/* ── Form submit validation ── */
document
  .getElementById("registerForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    let valid = true;

    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const role = document.querySelector('input[name="role"]:checked');
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirm = document.getElementById("confirmPassword");
    const terms = document.getElementById("terms");

    // First name
    if (!firstName.value.trim()) {
      showError(
        firstName,
        document.getElementById("firstName-error"),
        "First name is required.",
      );
      valid = false;
    } else {
      markValid(firstName);
    }

    // Last name
    if (!lastName.value.trim()) {
      showError(
        lastName,
        document.getElementById("lastName-error"),
        "Last name is required.",
      );
      valid = false;
    } else {
      markValid(lastName);
    }

    // Role
    const roleErr = document.getElementById("role-error");
    if (!role) {
      roleErr.classList.add("show");
      valid = false;
    } else {
      roleErr.classList.remove("show");
    }

    // Email
    if (!email.value.trim()) {
      showError(
        email,
        document.getElementById("email-error"),
        "Email address is required.",
      );
      valid = false;
    } else if (!isValidEmail(email.value.trim())) {
      showError(
        email,
        document.getElementById("email-error"),
        "Please enter a valid email address.",
      );
      valid = false;
    } else {
      markValid(email);
    }

    // Password
    if (!password.value) {
      showError(
        password,
        document.getElementById("password-error"),
        "Password is required.",
      );
      valid = false;
    } else if (password.value.length < 8) {
      showError(
        password,
        document.getElementById("password-error"),
        "Password must be at least 8 characters.",
      );
      valid = false;
    } else {
      markValid(password);
    }

    // Confirm password
    if (!confirm.value) {
      showError(
        confirm,
        document.getElementById("confirmPassword-error"),
        "Please confirm your password.",
      );
      valid = false;
    } else if (confirm.value !== password.value) {
      showError(
        confirm,
        document.getElementById("confirmPassword-error"),
        "Passwords do not match.",
      );
      valid = false;
    } else {
      markValid(confirm);
    }

    // Terms
    const termsErr = document.getElementById("terms-error");
    if (!terms.checked) {
      termsErr.classList.add("show");
      valid = false;
    } else {
      termsErr.classList.remove("show");
    }

    if (valid) {
      window.location.href = "login.html";
    } else {
      // Scroll to first error
      const firstErr = document.querySelector(
        ".is-invalid, .field-error.show, .role-error-msg.show",
      );
      if (firstErr)
        firstErr.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
