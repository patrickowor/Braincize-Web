import signStyle from "@/app/signup.module.css";

export default function login() {
    return <>
    <div className={signStyle.container}>
        <div className={signStyle.left_panel}>
          <div className={signStyle.overlay_text}>
                <h2>
                Welcome Back!
                </h2>
                <p className={signStyle.overP}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel placeat totam illum dicta ut accusantium, corporis voluptatum itaque cupiditate hic delectus unde ratione animi blanditiis doloribus autem eligendi omnis distinctio.</p>
          </div>
        </div>

        <div className={signStyle.right_panel}>
          <div className={signStyle.card}>
                <h1>Login</h1>
                <form>
                    <div className={signStyle.input_wrapper}>
                    <label htmlFor="userName">Username</label>
                    <input type="text" id="userName" name="userName" />
                    </div>
                    <div className={signStyle.input_wrapper}>
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" />
                    </div>

                    <button type="submit" className={signStyle.btn_primary}>
                        Login
                    </button>

                <div className={signStyle.divider}>
                    <span>or</span>
                </div>
                <p className={signStyle.small_text}>
                    Don't have an account? 
                </p>
                <div className={signStyle.social_buttons}>
                    <button type="button" className={signStyle.btn_social}>
                        <a href="/signup">Signup</a>
                    </button>
                </div>
                </form>
          </div>
        </div>
    </div>
</>
 
}