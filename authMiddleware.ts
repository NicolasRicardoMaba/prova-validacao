import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { UsuarioDAO } from './daos/UsuarioDAO';

const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'secret',
};

passport.use(
    new JwtStrategy(options, async (payload, done) => {
        try {
            const dao = new UsuarioDAO();
            const usuario = await dao.buscarPorId(payload.id);

            if (usuario) {
                return done(null, usuario);
            }
            return done(null, false);
        } catch (error) {
            return done(error, false);
        }
    })
);

export const authMiddleware = passport.authenticate('jwt', { session: false });
