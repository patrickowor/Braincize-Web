import signStyle from "@/app/signup.module.css";

export default function Signup() {
    return <>
    <div className={signStyle.container}>
        <div className={signStyle.left_panel}>
          <div className={signStyle.overlay_text}>
              <h2>
                An AI-powered Neuroimaging Tool
              </h2>
              <p className={signStyle.overP}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel placeat totam illum dicta ut accusantium, corporis voluptatum itaque cupiditate hic delectus unde ratione animi blanditiis doloribus autem eligendi omnis distinctio.</p>
          </div>
        </div>

        <div className={signStyle.right_panel}>
          <div className={signStyle.card}>
            <h1>Create Account</h1>
            <form>
              <div className={signStyle.name_group}>
                <div className={signStyle.input_wrapper}>
                  <label htmlFor="firstName">First Name</label>
                  <input type="text" id="firstName" name="firstName" />
                </div>
                <div className={signStyle.input_wrapper}>
                  <label htmlFor="lastName">Last Name</label>
                  <input type="text" id="lastName" name="lastName" />
                </div>
              </div>
              <div className={signStyle.input_wrapper}>
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" />
              </div>
              <div className={signStyle.input_wrapper}>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" />
              </div>
              <button type="submit" className={signStyle.btn_primary}>
                Create Account
              </button>

              <div className={signStyle.divider}>
                <span>or</span>
              </div>
              <p className={signStyle.small_text}>
                Already have an account? 
              </p>
              <div className={signStyle.social_buttons}>
                <button type="button" className={signStyle.btn_social}>
                    <a href="/login">Login</a>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
}